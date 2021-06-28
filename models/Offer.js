module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define("Offer", {
        Offer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Offer_Image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Discount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Promocode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });


    return Offer
}