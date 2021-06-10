module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        Admin_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    });



    return  Admin 
}