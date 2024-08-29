
export const validateResource = (resource) => {
    const error = {};
    if (!resource.name) {
        error.name = 'Please specify the resource name'
    }

    if (!resource.type) {
        error.type = 'Please specify the resource type'
    }

    return error;
}

export default function resourceValidations(resource) {
    return validateResource(resource);
}
