declare global {
    namespace Express {
        interface Request {
            userId: string | null | undefined
        }
    }
}

export { };
