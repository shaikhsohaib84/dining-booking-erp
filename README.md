# dining-booking-erp 

ERD - https://dbdiagram.io/d/Bismilallah-POS-65e35e9dcd45b569fb5ce8e7

Blocker's and solution's:
- blocker 1: Initially had only table-no acing as an FK at order-item(table), but dining-table will be getting free once billing is done from a customer, so the table-no(column/field) will be the same(will have the same record/id) relation with billing(table) then how to identity that which order is current one for the same table?

- solution 1: Included the new column called table-token(long text/uuid) which will be generated only for available tables, this will act as a temp- token/uuid till the cycle of billing. once billing is done, then this token will be removed from the respective table-no
*********************************************************************************************************************************************************************************
- blocker 2: mysqlclient not getting installed.

- solution 2:

  brew install pkg-config.

  $ export MYSQLCLIENT_LDFLAGS=$(pkg-config --libs mysqlclient)

  $ export MYSQLCLIENT_CFLAGS=$(pkg-config --cflags mysqlclient)

  $ pip install mysqlclient

- ToDo
  While deleting table, provide option to transfer order to another table. If the selected table is occupied.

  Add user, cafe - table.(Single brnad has multiple franchise and owner should be able to access across all the app's)

  Add dashboard for billing, profit and menu-item insights

  add kitchen only tab for order visibility inside the kitchen team

  Delete btn in menu tab.

  Remove btn, while adding the menu item.

  Display bill price on Home > occupied-table.

- Bug fix - High Priority

  while creating order for selected table on table tab, qty will always be 1 not 0.

- Bug fix - Low Priority 

  After selecting the menu tab, refresh the page selected tab not showing

  While adding new menu, ask which one to set in menu-list