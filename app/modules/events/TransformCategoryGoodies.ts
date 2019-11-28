export class TransformCategoryGoodies {
    private data: any;
    private result: any;
    private goody: any;
    private resultType: String;
    constructor(data: any, type: String) {
        this.data = data;
        this.resultType = type;
    }

    public transform() {
        try {
            if (this.resultType === 'all') {
                this.result = {};
                if (this.data.category) {
                    this.result.category = this.data.category;
                    this.result.all_goodies = [];
                    if (this.data.all_goodies && this.data.all_goodies.length > 0) {
                        this.data.all_goodies.map((data1, index) => {
                            this.goody = {};
                            this.goody.category_name = data1.category_name;
                            this.goody.item_category_id = data1.item_category_id;
                            this.goody.goodies = data1.goodies.filter((goody_data) => {
                                return goody_data.is_new === 1;
                            });
                            data1.goodies.filter((goody_data) => {
                                return goody_data.is_new !== 1;
                            }).map((data2, index) => {
                                this.goody.goodies.push(data2);
                            });
                            this.result.all_goodies.push(this.goody);
                        });
                    }
                }
            } else {
                this.result = this.data.filter((goody_data) => {
                    return goody_data.is_new === 1;
                });
                this.data.filter((goody_data) => {
                    return goody_data.is_new !== 1;
                }).map((data2, index) => {
                    this.result.push(data2);
                });
            }
            return this.result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export const transformCategoryGoodies = (items: any, type: String) => {
    return new TransformCategoryGoodies(items, type);
};
