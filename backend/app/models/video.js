/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('video', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(1),
            allowNull: true,
        },
        progress: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        converted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
};
