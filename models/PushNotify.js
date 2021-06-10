module.exports = (sequelize, DataTypes) => {
    const Notify = sequelize.define("Notify", {
        Notify_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        Subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Message: {
            type: DataTypes.STRING(1500),
            allowNull: false
        }
    });

    return Notify
}