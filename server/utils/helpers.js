// Response handler utility
const responseHandler = {
    success: (res, data, message = 'Thành công', statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    error: (res, error, message = 'Lỗi server', statusCode = 500) => {
        res.status(statusCode).json({
            success: false,
            message,
            error: error.message || error
        });
    }
};

// Validation helper
const validateRequired = (fields) => {
    return fields.every(value => value !== null && value !== undefined && value !== '');
};

module.exports = { responseHandler, validateRequired };
