const utils = {
  // get profile
  updateEntity: async (model, id, updateData) => {
    try {
      // Find the entity by ID
      const entity = await model.findByPk(id);
      if (!entity) {
        throw new Error(`${model.name} not found`);
      }

      // Update the entity fields
      for (const key in updateData) {
        if (updateData[key] !== undefined) {
          entity[key] = updateData[key];
        }
      }

      // Save the updated entity
      await entity.save();

      return entity;
    } catch (error) {
      throw new Error(`Error updating ${model.name}: ${error.message}`);
    }
  },

  deleteEntity: async (model, id) => {
    try {
      // Find the entity by ID
      const entity = await model.findByPk(id);
      if (!entity) {
        throw new Error(`${model.name} not found`);
      }

      // Delete the entity
      await entity.destroy();
    } catch (error) {
      throw new Error(`Error deleting ${model.name}: ${error.message}`);
    }
  },
};

export default utils;
