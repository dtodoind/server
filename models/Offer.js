module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define("Offer", {
        Offer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Offer_Image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Discount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });


    return Offer
}