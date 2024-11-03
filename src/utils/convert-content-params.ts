import { convertIntegerToNeo4jInteger } from './convert-integer-neo4j';

export function convertParamsNumber(contentParams) {
    if (contentParams == 'NULL') {
        return null;
    } else {
        return convertIntegerToNeo4jInteger(parseInt(contentParams));
    }
}
export function convertParamsString(contentParams) {
    if (contentParams == 'NULL') {
        return null;
    } else {
        return contentParams.replace(/['"]+/g, '');
    }
}
