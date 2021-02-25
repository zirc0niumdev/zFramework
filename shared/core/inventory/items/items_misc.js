let item = {};

item = {
  name: "Vêtement",
  weight: 0.1,
  onUse: "clothItem",
  keep: true,
};
zFramework.Core.Items.Register(item);

item = {
  name: "Carte d'identité",
  price: 2,
  weight: 0.05,
  onUse: "idItem",
  keep: true,
};
zFramework.Core.Items.Register(item);

item = {
  name: "Permis",
  price: 2,
  weight: 0.05,
  onUse: "idItem",
  keep: true,
};
zFramework.Core.Items.Register(item);