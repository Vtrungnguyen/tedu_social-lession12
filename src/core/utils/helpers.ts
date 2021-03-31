export const isEmptyObject = (obj: object): boolean => { // kiem tra doi tuong truyen vao co rong hay ko
    return !Object.keys(obj).length;
}