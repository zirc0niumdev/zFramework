zFramework.Core.Items = {};

let m_tblItemRegister = {};

zFramework.Core.Items.RegisterItem = tblItem => m_tblItemRegister[tblItem.name] = tblItem;
zFramework.Core.Items.IsValid = strItemName => (m_tblItemRegister[strItemName] && true) || false;

zFramework.Core.Items.GetItem = strItemName => m_tblItemRegister[strItemName];
zFramework.Core.Items.GetAllItems = () => m_tblItemRegister;