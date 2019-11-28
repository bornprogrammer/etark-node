
// import { sequelize } from '@app/config/Sequelize';

// const CartItemModel = sequelize.define<ICartItemInstance, ICartItem>(
//     'cart_item',
//     {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         cartId: { type: Sequelize.INTEGER, allowNull: false, field: 'cart_id' },
//         itemId: { type: Sequelize.INTEGER, allowNull: false, field: 'item_id' },
//         orderedUnit: { type: Sequelize.INTEGER, allowNull: false, field: 'ordered_unit' },
//         unitPrice: { type: Sequelize.INTEGER, allowNull: false, field: 'unit_price' },
//         subTotal: { type: Sequelize.INTEGER, allowNull: false, field: 'sub_total' },
//         discount: { type: Sequelize.INTEGER, allowNull: false, field: 'discount' },
//         netCost: { type: Sequelize.INTEGER, allowNull: false, field: 'net_cost' },
//         itemLookupId: { type: Sequelize.INTEGER, allowNull: false, field: 'item_lookup_id' },
//         deliveryStart: { type: Sequelize.INTEGER, allowNull: false, field: 'delivery_start' },
//         deliveryEnd: { type: Sequelize.INTEGER, allowNull: false, field: 'delivery_end' },

//     }, {
//         timestamps: true,
//         underscored: true
//     }
// )

// export default CartItemModel;
