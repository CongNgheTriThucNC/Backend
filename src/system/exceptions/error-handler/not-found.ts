export function notFoundHandler(req, res) {
    return res.status(404).json({
        message: `Can not ${req.method} ${req.path}`,
    });
}
