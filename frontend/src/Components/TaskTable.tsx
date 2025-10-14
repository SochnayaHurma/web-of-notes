import React, { Component, ReactNode, JSX } from 'react';
import { NavLink } from 'react-router-dom';
import {
  EuiBadge,
  EuiHealth,
  EuiButton,
  EuiButtonIcon,
  EuiCheckbox,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiPopover,
  EuiSpacer,
  EuiTable,
  EuiTableBody,
  EuiTableFooter,
  EuiTableFooterCell,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableHeaderCellCheckbox,
  EuiTablePagination,
  EuiTableRow,
  EuiTableRowCell,
  EuiTableRowCellCheckbox,
  EuiTableSortMobile,
  EuiTableHeaderMobile,
  EuiScreenReaderOnly,
  EuiTableFieldDataColumnType,
  EuiTableSortMobileProps,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
  HorizontalAlignment,
  Pager,
  SortableProperties,
  CENTER_ALIGNMENT,
  EuiButtonEmpty,
  EuiTabbedContent,
  EuiTab,
  EuiTabs
} from '@elastic/eui';

type Lesson = {
  subject: string;
  id: number;
  title: string;
  creationDate: string;
  status: string;
  countRepeat: number;
  lessonTags: string;
}

type Lessons = Lesson[];



function calcLessonStatus<JSX>(statusText: string) {
  const classes = {
    Пройден: 'success',
    Отложен: 'warning',
    Отменен: 'danger'
  }
  const currentState: string | undefined = classes[statusText];
  return <EuiBadge color={currentState}>{statusText}</EuiBadge>
}

async function prepareLessons() {
  const lessons: Lessons = await getAllLessons();
  return lessons.map((el: Lesson) => {
    return {
      id: el.id,
      subject: el.subject.title,
      type: 'user',
      title: el.title,
      creationDate: el.created_date,
      status: calcLessonStatus(el.status.name),
      countRepeat: el.count_used,
      lessonTags: el.lessonTags
    }
  })
}

interface TaskTableProps {
  status: string,
}
async function getAllLessons() {
  const response = await fetch('http://localhost:8000/api/v1/notes/')
  return await response.json()
}

class TaskTable extends Component<TaskTableProps> {
  testItems = [
    {
      id: 3,
      subject: 'Корейский ',
      title: {
        value: (
          <>
            A very long line in an ELEMENT which will not wrap on narrower
            screens and instead will become truncated and replaced by an
            ellipsis
          </>
        ),
        isLink: true,
      },
      creationDate: 'Tue Dec 16 2016',
      countRepeat: 100,
      status: this.props.status //'Пройден'
    },
  ]
  async componentDidMount(): void {
    try {
      const dataForTable = await prepareLessons();
      console.log('stop')
      const defaultItemsPerPage = 20;
      this.pager = new Pager(dataForTable.length, defaultItemsPerPage);
      this.setState((prevState) => ({
        ...prevState,
        items: dataForTable,
        firstItemIndex: this.pager.getFirstItemIndex(),
        lastItemIndex: this.pager.getLastItemIndex(),
      }))
    } catch (error) {
      console.log('error')
      console.log(error)
    }
  }
  // items = prepareLessons(this.testItems)
  columns = [
    // {
    //   id: 'checkbox',
    //   isCheckbox: true,
    //   textOnly: false,
    //   width: '32px',
    // },
    {
      id: 'type',
      label: 'Type',
      isVisuallyHiddenLabel: true,
      alignment: LEFT_ALIGNMENT,
      width: '24px',
      cellProvider: (cell) => <EuiIcon type={cell} size="m" />,
      mobileOptions: {
        show: false,
      },
    },
    {
      id: 'subject',
      label: 'Предмет',
      // footer: <em>Title</em>,
      alignment: LEFT_ALIGNMENT,
      isSortable: false,
      mobileOptions: {
        show: false,
      },
    },
    {
      id: 'title',
      label: 'Тема',
      // footer: <em>Title</em>,
      alignment: LEFT_ALIGNMENT,
      isSortable: false,

      mobileOptions: {
        show: false,
      },
    },
    {
      id: 'title_type',
      label: 'Title',
      mobileOptions: {
        only: true,
        header: false,
        enlarge: true,
        width: '100%',
      },
      render: (title, item) => (
        <>
          <EuiIcon
            type={item.type}
            size="m"
            style={{ verticalAlign: 'text-top' }}
          />{' '}
          {title}
        </>
      ),
    },
    {
      id: 'status',
      label: 'Статус',
      footer: '',
      alignment: CENTER_ALIGNMENT,
    },
    {
      id: 'creationDate',
      label: 'Дата создания',
      // footer: 'Date created',
      alignment: CENTER_ALIGNMENT,
      isSortable: true,
    },
    {
      id: 'countRepeat',
      label: 'Количество прохождений',
      footer: ({
        items,
        pagination,
      }) => {
        const { pageIndex, pageSize } = pagination;
        const startIndex = pageIndex * pageSize;
        const pageOfItems = items.slice(
          startIndex,
          Math.min(startIndex + pageSize, items.length)
        );
        return (
          <strong>
            Total: {pageOfItems.reduce((acc, cur) => acc + cur.magnitude, 0)}
          </strong>
        );
      },
      alignment: RIGHT_ALIGNMENT,
      isSortable: true,
    },
    {
      id: 'actions',
      label: 'Actions',
      isVisuallyHiddenLabel: true,
      alignment: RIGHT_ALIGNMENT,
      isActionsPopover: true,
      width: '32px',
    },
  ];

  sortableProperties;
  pager;

  constructor(props) {
    super(props);


    const defaultItemsPerPage = 20;
    this.pager = new Pager(0, defaultItemsPerPage);

    this.state = {
      items: [],
      itemIdToSelectedMap: {},
      itemIdToOpenActionsPopoverMap: {},
      sortedColumn: 'countRepeat',
      itemsPerPage: defaultItemsPerPage,
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    };

    this.sortableProperties = new SortableProperties(
      [
        {
          name: 'creationDate',
          getValue: (item) => item.dateCreated.toLowerCase(),
          isAscending: true,
        },
        {
          name: 'countRepeat',
          getValue: (item) => String(item.magnitude).toLowerCase(),
          isAscending: true,
        },
        {
          name: 'subject',
          getValue: (item) => String(item.magnitude).toLowerCase(),
          isAscending: true,
        },
      ],
      this.state.sortedColumn
    );
  }

  onChangeItemsPerPage = (itemsPerPage) => {
    this.pager.setItemsPerPage(itemsPerPage);
    this.setState({
      itemsPerPage,
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  onChangePage = (pageIndex) => {
    this.pager.goToPageIndex(pageIndex);
    this.setState({
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  onSort = (prop) => {
    this.sortableProperties.sortOn(prop);

    this.setState({
      sortedColumn: prop,
    });
  };

  toggleItem = (itemId) => {
    this.setState((previousState) => {
      const newItemIdToSelectedMap = {
        ...previousState.itemIdToSelectedMap,
        [itemId]: !previousState.itemIdToSelectedMap[itemId],
      };

      return {
        itemIdToSelectedMap: newItemIdToSelectedMap,
      };
    });
  };

  toggleAll = () => {
    const allSelected = this.areAllItemsSelected();
    const newItemIdToSelectedMap = {};
    this.state.items.forEach(
      (item) => (newItemIdToSelectedMap[item.id] = !allSelected)
    );

    this.setState({
      itemIdToSelectedMap: newItemIdToSelectedMap,
    });
  };

  isItemSelected = (itemId) => {
    return this.state.itemIdToSelectedMap[itemId];
  };

  areAllItemsSelected = () => {
    const indexOfUnselectedItem = this.state.items.findIndex(
      (item) => !this.isItemSelected(item.id)
    );
    return indexOfUnselectedItem === -1;
  };

  areAnyRowsSelected = () => {
    return (
      Object.keys(this.state.itemIdToSelectedMap).findIndex((id) => {
        return this.state.itemIdToSelectedMap[id];
      }) !== -1
    );
  };

  togglePopover = (itemId) => {
    this.setState((previousState) => {
      const newItemIdToOpenActionsPopoverMap = {
        ...previousState.itemIdToOpenActionsPopoverMap,
        [itemId]: !previousState.itemIdToOpenActionsPopoverMap[itemId],
      };

      return {
        itemIdToOpenActionsPopoverMap: newItemIdToOpenActionsPopoverMap,
      };
    });
  };

  closePopover = (itemId) => {
    // only update the state if this item's popover is open
    if (this.isPopoverOpen(itemId)) {
      this.setState((previousState) => {
        const newItemIdToOpenActionsPopoverMap = {
          ...previousState.itemIdToOpenActionsPopoverMap,
          [itemId]: false,
        };

        return {
          itemIdToOpenActionsPopoverMap: newItemIdToOpenActionsPopoverMap,
        };
      });
    }
  };

  isPopoverOpen = (itemId) => {
    return this.state.itemIdToOpenActionsPopoverMap[itemId];
  };

  renderSelectAll = (mobile) => {
    return (
      <EuiCheckbox
        id={mobile ? 'selectAllCheckboxMobile' : 'selectAllCheckboxDesktop'}
        label={mobile ? 'Select all rows' : null}
        aria-label="Select all rows"
        title="Select all rows"
        checked={this.areAllItemsSelected()}
        onChange={this.toggleAll.bind(this)}
      />
    );
  };

  getTableMobileSortItems() {
    const items = [];

    this.columns.forEach((column) => {
      if (column.isCheckbox || !column.isSortable) {
        return;
      }
      items.push({
        name: column.label,
        key: column.id,
        onSort: this.onSort.bind(this, column.id),
        isSorted: this.state.sortedColumn === column.id,
        isSortAscending: this.sortableProperties.isAscendingByName(column.id),
      });
    });
    return items;
  }

  renderHeaderCells() {
    const headers = [];

    this.columns.forEach((column, columnIndex) => {
      if (column.isCheckbox) {
        headers.push(
          <EuiTableHeaderCellCheckbox key={column.id} width={column.width}>
            {this.renderSelectAll()}
          </EuiTableHeaderCellCheckbox>
        );
      } else if (column.isVisuallyHiddenLabel) {
        headers.push(
          <EuiTableHeaderCell key={column.id} width={column.width}>
            <EuiScreenReaderOnly>
              <span>{column.label}</span>
            </EuiScreenReaderOnly>
          </EuiTableHeaderCell>
        );
      } else {
        headers.push(
          <EuiTableHeaderCell
            key={column.id}
            align={this.columns[columnIndex].alignment}
            width={column.width}
            onSort={
              column.isSortable ? this.onSort.bind(this, column.id) : undefined
            }
            isSorted={this.state.sortedColumn === column.id}
            isSortAscending={this.sortableProperties.isAscendingByName(
              column.id
            )}
            mobileOptions={column.mobileOptions}
          >
            {column.label}
          </EuiTableHeaderCell>
        );
      }
    });
    return headers.length ? headers : null;
  }

  renderRows() {
    const renderRow = (item) => {

      if (!item) {
        return <></>;
      }
      const cells = this.columns.map((column) => {
        const cell = item[column.id];

        let child;

        if (column.isCheckbox) {
          return (
            <EuiTableRowCellCheckbox key={column.id}>
              <EuiCheckbox
                id={`${item.id}-checkbox`}
                checked={this.isItemSelected(item.id)}
                onChange={this.toggleItem.bind(this, item.id)}
                title="Select this row"
                aria-label="Select this row"
              />
            </EuiTableRowCellCheckbox>
          );
        }

        if (column.isActionsPopover) {
          return (
            <EuiTableRowCell
              key={column.id}
              textOnly={false}
              hasActions={true}
              align="right"
              mobileOptions={{ header: column.label }}
            >
              <EuiPopover
                id={`${item.id}-actions`}
                button={
                  <EuiButtonIcon
                    aria-label="Actions"
                    iconType="gear"
                    size="s"
                    color="text"
                    onClick={() => this.togglePopover(item.id)}
                  />
                }
                isOpen={this.isPopoverOpen(item.id)}
                closePopover={() => this.closePopover(item.id)}
                panelPaddingSize="none"
                anchorPosition="leftCenter"
              >
                <EuiContextMenuPanel
                  items={[
                    <EuiContextMenuItem
                      key="A"
                      icon="pencil"
                      onClick={() => {
                        this.closePopover(item.id);
                      }}
                    >
                      Edit
                    </EuiContextMenuItem>,
                    <EuiContextMenuItem
                      key="B"
                      icon="share"
                      onClick={() => {
                        this.closePopover(item.id);
                      }}
                    >
                      Share
                    </EuiContextMenuItem>,
                    <EuiContextMenuItem
                      key="C"
                      icon="trash"
                      onClick={() => {
                        this.closePopover(item.id);
                      }}
                    >
                      Delete
                    </EuiContextMenuItem>,
                  ]}
                />
              </EuiPopover>
            </EuiTableRowCell>
          );
        }

        if (column.id === 'title' || column.id === 'title_type') {
          let title = item.title;

          if ((item.title)?.value) {
            const titleObj = item.title;
            const titleText = titleObj.value;
            title = titleObj.isLink ? (
              <NavLink to={`/lesson/${item.id}`}>{titleText}</NavLink>
            ) : (
              titleText
            );
          }

          if (column.render) {
            child = column.render(title, item);
          } else {
            child = title;
          }
        } else if (column.cellProvider) {
          child = column.cellProvider(cell);
        } else {
          child = cell;
        }
        return (
          <EuiTableRowCell
            key={column.id}
            align={column.alignment}
            truncateText={(cell)?.truncateText}
            textOnly={column.textOnly || false}
            mobileOptions={{
              header: column.label,
              ...column.mobileOptions,
              render: column.mobileOptions?.render?.(item),
            }}
          >
            {child}
          </EuiTableRowCell>
        );
      });

      return (
        <EuiTableRow
          key={item.id}
          isSelected={this.isItemSelected(item.id)}
          hasSelection={true}
          hasActions={true}
        >
          {cells}
        </EuiTableRow>
      );
    };

    const rows = [];

    for (
      let itemIndex = this.state.firstItemIndex;
      itemIndex <= this.state.lastItemIndex;
      itemIndex++
    ) {
      console.log(this.state)
      const item = this.state.items[itemIndex];
      rows.push(renderRow(item));
    }

    return rows;
  }

  renderFooterCells() {
    const footers = [];

    const items = this.state.items;
    const pagination = {
      pageIndex: this.pager.getCurrentPageIndex(),
      pageSize: this.state.itemsPerPage,
      totalItemCount: this.pager.getTotalPages(),
    };

    this.columns.forEach((column) => {
      const footer = this.getColumnFooter(column, { items, pagination });
      if (column.mobileOptions && column.mobileOptions.only) {
        return; // exclude columns that only exist for mobile headers
      }

      if (footer) {
        footers.push(
          <EuiTableFooterCell
            key={`footer_${column.id}`}
            align={column.alignment}
          >
            {footer}
          </EuiTableFooterCell>
        );
      } else {
        footers.push(
          <EuiTableFooterCell
            key={`footer_empty_${footers.length - 1}`}
            align={column.alignment}
          >
            {undefined}
          </EuiTableFooterCell>
        );
      }
    });
    return footers;
  }

  getColumnFooter = (
    column,
    {
      items,
      pagination,
    }
  ) => {
    if (column.footer === null) {
      return null;
    }

    if (column.footer) {
      if (typeof column.footer === 'function') {
        return column.footer({ items, pagination });
      }
      return column.footer;
    }

    return undefined;
  };

  render() {
    let optionalActionButtons;
    const exampleId = 'example-id';

    if (!!this.areAnyRowsSelected()) {
      optionalActionButtons = (
        <EuiFlexItem grow={false}>
          <EuiButton color="danger">Delete selected</EuiButton>
        </EuiFlexItem>
      );
    }
    const tabs = [
      {
        id: 1,
        name: 'Все',
      },
      {
        id: 2,
        name: 'Назначенные',
      },
      {
        id: 3,
        name: 'Завершенные',
      },
    ];

    return (
      <>
        <EuiFlexGroup gutterSize="m">
          {optionalActionButtons}

          <EuiFlexItem>
            <EuiFieldSearch fullWidth placeholder="Поиск..." />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="m" />

        <EuiTableHeaderMobile>
          <EuiFlexGroup
            responsive={false}
            justifyContent="spaceBetween"
            alignItems="baseline"
          >
            <EuiFlexItem grow={false}>{this.renderSelectAll(true)}</EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiTableSortMobile items={this.getTableMobileSortItems()} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiTableHeaderMobile>

        <EuiTable id={exampleId}>
          <EuiTableHeader>{this.renderHeaderCells()}</EuiTableHeader>

          <EuiTableBody>{this.renderRows()}</EuiTableBody>

          <EuiTableFooter>{this.renderFooterCells()}</EuiTableFooter>
        </EuiTable>

        <EuiSpacer size="m" />

        <EuiTablePagination
          aria-label="Custom EuiTable demo"
          aria-controls={exampleId}
          activePage={this.pager.getCurrentPageIndex()}
          itemsPerPageOptions={[5, 10, 20]}
          pageCount={this.pager.getTotalPages()}
          onChangeItemsPerPage={this.onChangeItemsPerPage}
          onChangePage={this.onChangePage}
          compressed
        />
      </>
    );
  }
}




export default TaskTable;