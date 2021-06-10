module.exports = (sequelize, DataTypes) => {
    const TopImages = sequelize.define("TopImages", {
        TopImages_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: false
    });


    return  TopImages
}