/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('project', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        investment: {
            type: "DOUBLE",
            allowNull: true
        },
        involved: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        motivation: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ''
        },
        benefits: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ''
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ''
        },
        registry_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        construction_time: {
            type: "integer",
            allowNull: false
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        videos: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
};
