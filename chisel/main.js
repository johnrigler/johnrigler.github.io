mainMenu = menuFactory();

mainMenu.tools.add("welcome","Welcome")
mainMenu.tools.add("demo","Demonstration")
mainMenu.tools.add("address","Ledger View")
mainMenu.tools.add("import","Import Image")
mainMenu.tools.add("draw","Draw")
mainMenu.tools.add("wallet","Wallet")
mainMenu.tools.add("save", "Save/Load");
mainMenu.tools.add("help", "Help");
mainMenu.tools.add("about","About");

mainMenu.tools.addSubmenu("help","about", "About", "");
mainMenu.tools.addSubmenu("help","demo", "Demo", "");
mainMenu.tools.addSubmenu("help","config", "Config", "");
