module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        Notification_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Notify_cate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    // Notification.associate = models => {
    //     Notification.belongsTo(models.Users, {
    //         onDelete: 'cascade',
    //         foreignKey: "Users_id"
    //     })
    // }

    return Notification
}