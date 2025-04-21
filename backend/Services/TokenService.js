import jwt from 'jsonwebtoken';
import admin from '../Config/Firebase.js'

const clientSecret = "chapuCataNegrita";

export default {
    encode: async (uid, email) => {
        const token = jwt.sign({  uid, email }, clientSecret, { expiresIn: '24h' });
        return token;
    },

    decode: async (token) => {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const { uid, email, name } = decodedToken;

            return { uid, email, name };

        } catch (e) {
            throw e;
        }
    }
}