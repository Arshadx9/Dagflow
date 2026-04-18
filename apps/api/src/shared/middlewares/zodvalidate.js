import Apperror from "../utils/Apperror";
const ZodValidate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = result.error.issues[0]?.message ?? "Validation error";
            throw new Apperror(400, message);
        }
        next();
    };
};
export default ZodValidate;
