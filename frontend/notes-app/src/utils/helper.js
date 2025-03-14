export const validateEmail = (email)=> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//valide email check
console.log(validateEmail("grantovedje@gmail.com"));
console.log(validateEmail("grant-ovedje"));