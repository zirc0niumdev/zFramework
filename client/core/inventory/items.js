let onUseFunc = {};

onUseFunc["test"] = () => {
    zFramework.Functions.Notify("Test");
}

GetUseItemFromName = _ => onUseFunc[_];
