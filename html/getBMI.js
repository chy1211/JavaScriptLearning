function getBMI(height = 1.77 , weight = 55){
    const bmi = weight / (height * height);
    return bmi;
}
export {getBMI}