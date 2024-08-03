'use strict';
const Sequelize = require('sequelize');
class DataCollection {
 
  constructor(model) {
    this.model = model;
  }
 
  get(id) {
    if (id) {
      return this.model.findOne({ where: { id: id } });
    }
    else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update = async (id, data) => {
    console.log('id', id);
    console.log('data', data);
    const record = await this.model.findOne({where: { id: id }});
    console.log('record', record);
    return record.update(data);
  }


  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

}

module.exports = DataCollection;
