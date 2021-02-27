let item = {};

item = {
  name: "Snickers",
  price: 1,
  weight: 0.1,
  onUse: "eatItem",
  hunger: 10
};
zFramework.Core.Items.Register(item);

item = {
  name: "Pain",
  price: 15,
  onUse: "eatItem",
  hunger: 35
};
zFramework.Core.Items.Register(item);

item = {
  name: "Eau de source",
  price: 2,
  weight: 0.3,
  onUse: "drinkItem",
  thirst: 35
};
zFramework.Core.Items.Register(item);
