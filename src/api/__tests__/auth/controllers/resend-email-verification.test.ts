import { mountGlobalStrapi } from '../../../../utils/strapi';
import resendEmailVerification from '../../../auth/controllers/resend-email-verification';

/**
 * Mock Strapi context
 */
let ctx;

/**
 * Fixtures
 */
const mockUser = {
    id: 3,
    username: 'testUser',
    email: 'test1@strapi.com',
    confirmed: false,
};

describe('Auth/Controller/Resend-Email-Verification', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        ctx = {
            state: {
                user: mockUser,
            },
            badRequest: jest.fn(),
            send: jest.fn(),
        };
    });
    it('should send a new verification code mail', async () => {
        mountGlobalStrapi({
            service() {
                return {
                    createEmailVerificationCodeForUser: jest.fn().mockResolvedValue({ code: '', expires: 0 }),
                    sendVerificationEmail: jest.fn().mockResolvedValue(null),
                };
            },
        });
        await resendEmailVerification.resendEmail(ctx);
        expect(ctx.send).toHaveBeenCalledWith(
            {
                message: `New verification code is sent to ${mockUser.email}.`,
                expires: 0,
            },
            200,
        );
    });
    it('should return error if user is already authenticated', async () => {
        ctx.state.user.confirmed = true;
        await resendEmailVerification.resendEmail(ctx);
        expect(ctx.badRequest).toHaveBeenCalledWith('User is already authenticated.');
    });
});
