zFramework.Items = {};

let m_tblItemRegister = {};

zFramework.Items.RegisterItem = tblItem => m_tblItemRegister[tblItem.name] = tblItem;
zFramework.Items.IsItemValid = strItemName => (m_tblItemRegister[strItemName] && true) || false;

zFramework.Items.GetItem = strItemName => m_tblItemRegister[strItemName] || {};
zFramework.Items.GetAllItems = () => m_tblItemRegister || {}
