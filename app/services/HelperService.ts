
export default class ObjectCreationHelper {

    // {name,age,desc,email} {0:name,1:age,description:desc}
    public extractKeyAndValFromObj(reqObj: object, inpObj: object) {

        let outputObj;

        for (let property in inpObj) {
            if (typeof(property) == 'number') {
                outputObj[property] = reqObj[property];
            } else {

            }
        }

    }

}
