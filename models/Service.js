module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define("Service", {
        Service_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Select: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: false
    });


    return Service 
}