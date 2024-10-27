export function convertNeo4jInteger(neo4jInteger) {
    if (neo4jInteger.high === 0) {
        return neo4jInteger.low; // Giá trị nhỏ có thể dùng `low`
    }
    // Xử lý giá trị lớn với BigInt
    return (
        BigInt(neo4jInteger.high) * BigInt(2 ** 32) + BigInt(neo4jInteger.low)
    );
}
