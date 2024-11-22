interface ApisFunctionParameter {
    query?: any
}

var mainURL = "https://crudcrud.com/api/43c49224f8db4ee5817bb0d86f372f08/"

export const DEMO_API_FUNC = async (query: ApisFunctionParameter) => {
    const furtherUrl = "demo";
    const fullUrl = mainURL + furtherUrl;
    return {
        fullUrl: fullUrl, // Use the resolved baseURL
        method: 'GET',
        token: true,
        customHeaders: null
    };
};
export const SECOND_API_FUNC = async (query: ApisFunctionParameter) => {
    const furtherUrl = "sec";
    const fullUrl = mainURL + furtherUrl;
    return {
        fullUrl: "http://universities.hipolabs.com/search?country=United+States", // Use the resolved baseURL
        method: 'GET',
        token: true,
        customHeaders: null
    };
};

