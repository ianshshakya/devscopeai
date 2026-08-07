import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

export const configurePassport = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy_client_id',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_client_secret',
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/auth/github/callback',
        scope: ['user:email', 'read:user', 'public_repo'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            user.accessToken = accessToken;
            user.avatar = profile.photos?.[0]?.value || user.avatar;
            user.username = profile.username || user.username;
            await user.save();
            return done(null, user);
          }

          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value || '',
            accessToken,
            bio: profile._json?.bio || '',
            location: profile._json?.location || '',
            company: profile._json?.company || '',
            publicRepos: profile._json?.public_repos || 0,
            followers: profile._json?.followers || 0,
            following: profile._json?.following || 0,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-accessToken');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
