export function makeMember(_userDetails= []) {
   
    const {
        username,
        image,
        portfolio,
        description,
        status,
        addressRecievable,
     } = _userDetails;

    return Object.freeze({
        username,
        image,
        portfolio,
        description,
        status,
        addressRecievable,
      
    });
}