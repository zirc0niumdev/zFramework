zFramework.Core.Items = {};

let m_tblItemRegister = {};

zFramework.Core.Items.Register = tblItem => m_tblItemRegister[tblItem.name] = tblItem;
zFramework.Core.Items.IsValid = name => (m_tblItemRegister[name] && true) || false;

zFramework.Core.Items.Get = name => m_tblItemRegister[name];
zFramework.Core.Items.GetAll = () => m_tblItemRegister;