module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        Users_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // Username: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     unique: true,
        // },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Phoneno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Address: {
            type: DataTypes.STRING(3000),
            allowNull: true
        },
        Zip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Gender: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        Image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        confirmationCode: { 
            type: DataTypes.STRING(1500),
			defaultValue: false,
        }
    });

    Users.associate = models => {
        // Users.belongsTo(models.Product, {
        //     foreignKey: "Product_id"
        // })
        Users.hasMany(models.Orders, {
            onDelete: 'cascade',
            foreignKey: "Users_id"
        })
        Users.hasMany(models.Review, {
            onDelete: 'cascade',
            foreignKey: "Users_id"
        })
    }

    return Users
}