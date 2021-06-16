module.exports = (sequelize, DataTypes) => {
	const Delivery = sequelize.define(
		"Delivery",
		{
			Delivery_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			Region: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Charges: {
				type: DataTypes.INTEGER,
				allowNull: false,
			}
		},
		{
			timestamps: false,
		}
	);
  
	return Delivery;
  };