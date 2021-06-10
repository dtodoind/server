module.exports = (sequelize, DataTypes) => {
    const HeroImages = sequelize.define("HeroImages", {
        HeroImages_id: {
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



    return  HeroImages
}