import * as neo4j from 'neo4j-driver';
export function convertIntegerToNeo4jInteger(number) {
    return neo4j.int(number);
}
export function convertNeo4jIntegerToInteger(neo4jInteger) {
    if (neo4jInteger.high === 0) {
        return neo4jInteger.low; // Giá trị nhỏ có thể dùng `low`
    }
    // Xử lý giá trị lớn với BigInt
    return (
        BigInt(neo4jInteger.high) * BigInt(2 ** 32) + BigInt(neo4jInteger.low)
    );
}
