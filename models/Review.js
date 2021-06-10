module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("Review", {
        Review_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Message: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Review.associate = models => {
        Review.belongsTo(models.Users, {
            foreignKey: "Users_id"
        })
    }

    return Review
}