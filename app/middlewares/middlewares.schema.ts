import AuthenticationMiddleware from './AuthenticationMiddleware';
import DishOwnerMiddleware from './DishOwnerMiddleware';

// app level middleware
export const appMiddleware = [
    AuthenticationMiddleware,
    DishOwnerMiddleware,
];

export const middlewareForSelectedAPI = {
    AuthenticationMiddleware: [
        'api/feature1/second',
        'api/feature1/second',
        'api/feature1/abhi',
        'api/feature1/second',
        'api/feature1/second',
        'api/feature1/sandeep',
    ],
    DishOwnerMiddleware: [
        'api/feature1/second',
        'api/feature1/abhi',
        'api/feature1/sandeep',
    ],
    *[Symbol.iterator]() {
        const properties = Object.keys(this);
        for (const i of properties) {
            yield [i, this[i]];
        }
    },
};
