'use strict';

class DataCollection {

    constructor(model) {
        this.model = model;
    }

    get(_id) {
        try {
            if (_id) {
                return this.model.findOne({ _id });
            }
            else {
                return this.model.find({});
            }
        } catch (error) {
            throw new Error(error.message)
        }

    }

    create(record) {
        try {
            let newRecord = new this.model(record);
            return newRecord.save();
        } catch (error) {
            throw new Error(error.message)
        }
    }

    update(_id, record) {
        try {
            return this.model.findByIdAndUpdate(_id, record, { new: true });
        } catch (error) {
            throw new Error(error.message)
        }
    }

    delete(_id) {
        try {
            return this.model.findByIdAndDelete(_id);
        } catch (error) {
            throw new Error(error.message)
        }
    }

}

module.exports = DataCollection;