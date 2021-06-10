module.exports = (sequelize, DataTypes) => {
    const Aboutus = sequelize.define("Aboutus", {
        Aboutus_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Content: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
    },
    {
        timestamps: false
    });


    return Aboutus
}