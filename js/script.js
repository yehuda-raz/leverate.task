$(document).ready(function () {

    /**************************************
     **** Category & Status DropDown  *****
    **************************************/


    // remove some design from dd in the Modol
    $('#addEditTodoModol .dropdown button.dropdown-toggle').removeClass('btn-secondary').addClass('btn-light btn-outline-secondary')

    // Set the choosen drop down on the button 
    $('.dropdown.my-dropdown').on("click", "a", function (e) {
        e.preventDefault();
        const slectedName = $(this).find('.ddo-name').text();
        const button = $(this).closest('.my-dropdown').find('.dropdown-toggle')

        if ($(this).attr("category-id")) {
            button.attr("category-id", $(this).attr("category-id"));
        }

        if ($(this).attr("status-id")) {
            button.attr("status-id", $(this).attr("status-id"));
        }

        button.text(slectedName);

    });


    // DropDown Filter tabel by categorys
    $('#categorys-dd-filter').on("click", "a", function (e) {
        e.preventDefault(); // cancel the link behaviour

        const $cat_id = $(this).attr("category-id");
        const $cat_name = $(this).find('.ddo-name').text()
        const $cat_td_num = $(this).find('.cat_count').text()

        $("#categorys-dd-filter button").text($cat_name);

        $(".cat-apper-todo-cout").text($cat_td_num);

        if ($cat_id) {
            $("#tbl-area table tbody tr").filter(function () {
                $(this).toggle($(this).attr("category-id") == $cat_id)

            });
        } else {
            showAllCat()
        }
    });




    /************************
     **** Sort tabel *****
    *********************/


    // set up down to html for sorting
    const sortElemnts = $('#tbl-area table thead th').map(function () {
        if ($(this)[0].hasAttribute('sort-by')) {
            return this
        }
    })
    sortElemnts.append('<div class="d-inline-block px-2 sort"><span class="oi oi-caret-top text-secondary"></span><span class="oi  oi-caret-bottom text-secondary"> </span> <div>').css('cursor', 'pointer');


    // Sort
    let sortCell;
    let table, tableBody, tableHead;

    sortElemnts.on('click', function () {

        if (sortCell !== this) {
            sortCell = this;
            table = $(sortCell).closest('table'),
                tableBody = $(table).find('tbody'),
                tableHead = $(table).find('thead tr th'),
                sortby = $(sortCell).attr("sort-by").toUpperCase()
            $(tableHead).removeClass('desc asc');
        }

        if ($(sortCell).hasClass('desc')) {
            $(sortCell).removeClass('desc').addClass('asc');
            tableBody.find('tr').sort(function (a, b) {
                const element_a = $('td:nth-child(' + ($(sortCell).index() + 1) + ')', a).text(),
                    element_b = $('td:nth-child(' + ($(sortCell).index() + 1) + ')', b).text();
                switch (sortby) {
                    case 'NUMBER':
                        return element_b - element_a;
                    case 'NAME':
                        return element_b.localeCompare(element_a);
                    case 'DATE':
                        return new Date(element_b) - new Date(element_a);
                    default:
                        return element_b - element_a;
                }
            }).appendTo(tableBody);
        } else {
            $(sortCell).removeClass('asc').addClass('desc');
            tableBody.find('tr').sort(function (a, b) {
                const element_a = $('td:nth-child(' + ($(sortCell).index() + 1) + ')', a).text(),
                    element_b = $('td:nth-child(' + ($(sortCell).index() + 1) + ')', b).text();
                switch (sortby) {
                    case 'NUMBER':
                        return element_a - element_b;
                    case 'NAME':
                        return element_a.localeCompare(element_b);
                    case 'DATE':
                        return new Date(element_a) - new Date(element_b);
                    default:
                        return element_a - element_b;
                }
            }).appendTo(tableBody);
        }
    });


    const showAllCat = () => {
        $("#tbl-area table tbody tr").filter(function () {
            $(this).show()
        });
    }






    /**************************************
    **** Modols flow  & action *****
    **************************************/

    let flow = {};




    // Add edit - ToDo Modol
    $('#addEditTodoModol').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget)
        const modal = $(this);

        if (button.data('edit')) {
            const Sender = button.closest('tr')
            const rowSender = getRowData(Sender)

            flow.row = Sender;

            modal.find('.modal-title').text(`Edit item id ${rowSender.taskId}`);
            modal.attr("task-id", rowSender.taskId);
            modal.find('#action-new-edit-task').attr("mode", "edit").text('Edit Item');
            modal.find('#category-name-form button').attr('category-id', rowSender.catId).text(rowSender.catText);
            modal.find('#todo-taskName-form textarea').val(rowSender.taskName)
            modal.find('#todo-taskStatus-form button').text(rowSender.taskStaus)
            modal.find('#todo-taskStatus-form button').attr('status-id', rowSender.taskStaus)
            $('#addEditTodoModol').find('.is-invalid').removeClass('is-invalid');

            // modal.find('button.show-addCategory').attr("mode", "edit")

        } else if (button.data('new')) {
            const modal = $(this);
            modal.find('.modal-title').text(`Add new item`);
            modal.removeAttr("task-id")
            modal.find('#action-new-edit-task').attr("mode", "new").text('Add item');
            modal.find('#category-name-form button').removeAttr('category-id').text('Select category');

            modal.find('#todo-taskName-form textarea').val('')
            modal.find('#todo-taskStatus-form button').text('Select status')
            modal.find('#todo-taskStatus-form button').removeAttr('status-id')
            // modal.find('button.show-addCategory').attr("mode", "new")
            resetFormModols($('#addEditTodoModol'))

        }


    })


    const resetFormModols = (ele) => {
        ele.find('.is-invalid').removeClass('is-invalid');
        ele.find('.loader-div').css("display", "none");
        ele.find('input').val('')

    }





    $('#addCategory').on('hide.bs.modal', function (event) {
        resetFormModols($('#addCategory'))

    })

    $('#DeleteTodoModol').on('hide.bs.modal', function (event) {
        resetFormModols($('#DeleteTodoModol'))

    })


    /************************
     **** Delete Modol *****
     *********************/


    /***  Open delete Modol open****/
    $('#tbl-area table tbody ').on("click", "tr .delete-todo", function (e) {
        e.preventDefault(); // cancel the link behaviour
        const Sender = $(this).closest('tr');
        flow.row = Sender;
        const rowSender = getRowData(Sender);
        $('#item-del-id').text(rowSender.taskId)
        $('#item-del-cat').text(rowSender.catText)
        $('#item-del-task').text(rowSender.taskName)
        $('#DeleteTodoModol').modal('show');
    });


    /***  Delete Modol action****/
    $('#del-item-action').on("click", function (e) {
        e.preventDefault(); // cancel the link behaviour
        const rowFrom = flow.row;

        const taskId = rowFrom.find('td').attr('task-id')
        const catID = rowFrom.attr('category-id')

        $(this).closest('.modal').find('.loader-div').css("display", "block");

        $.ajax({
            url: "action.php",
            type: 'POST',
            dataType: "json",
            data: {
                action: 'del_task',
                form_data: {
                    'task_id': taskId
                }
            },
            success: function (resp) {
                if (resp.status === 'success') {

                    rowFrom.remove();
                    // update Categorys numbers
                    $elTotalCatNum = $('.cat_count-all');
                    $elCatItemNum = $('.dropdown.cat-dropdown').find(`a[category-id = ${catID}] .cat_count`);
                    $elTotalCatNum.text(parseInt($elTotalCatNum.first().text()) - 1);
                    $elCatItemNum.text(parseInt($elCatItemNum.first().text()) - 1);


                } else if (resp.status == 'error') {
                    alert(resp.statusCause)
                    modal.find('.loader-div').css("display", "none");
                }
            },

        });


        $('#DeleteTodoModol').modal('hide');

    });


    /*****************************
     **** End Delete Modol *******
     ****************************/




    $('#action-new-edit-task').on("click", function (e) {

        const modal = $(this).closest('.modal');
        const category = modal.find('#category-name-form button');
        const task = modal.find('textarea');
        const taskStatus = modal.find('#todo-taskStatus-form button');

        const validation = [task, category, taskStatus]
        passValidation(validation)


        if (!modal.find('.is-invalid').length) {

            const data = {
                'task': task.val().trim(),
                'taskId': modal.attr('task-id'),
                'categoryId': category.attr('category-id'),
                'taskStatusId': taskStatus.attr('status-id')
            }


            modal.find('.loader-div').css("display", "block");


            if ($(this).attr('mode') === 'new') {
                $.ajax({
                    url: "action.php",
                    type: 'POST',
                    dataType: "json",
                    data: {
                        action: 'add_task',
                        form_data: data
                    },
                    success: function (resp) {
                        if (resp.status === 'success') {

                            $row = resp.row;
                            $('#tbl-area table tbody').prepend($row);

                            modal.find('.loader-div').css("display", "none");
                            alert('Added successfully');
                            $('#addEditTodoModol').modal('hide')
                            $('#categorys-dd-filter .all-cat-dd').click();

                            // update Categorys numbers
                            $elTotalCatNum = $('.cat_count-all');
                            $elCatItemNum = $('.dropdown.cat-dropdown').find(`a[category-id = ${data.categoryId}] .cat_count`);
                            debugger;
                            $elTotalCatNum.text(parseInt($elTotalCatNum.first().text()) + 1);
                            $elCatItemNum.text(parseInt($elCatItemNum.first().text()) + 1);
                            $elCatItemNum.click()



                        } else if (resp.status == 'error') {
                            modal.find('.loader-div').css("display", "none");
                        }
                    },

                });

            }

            if ($(this).attr('mode') === 'edit') {
                $.ajax({
                    url: "action.php",
                    type: 'POST',
                    dataType: "json",
                    data: {
                        action: 'edit_task',
                        form_data: data
                    },
                    success: function (resp) {
                        if (resp.status === 'success') {


                            const rowFrom = flow.row;

                            const preCat = rowFrom.attr('category-id');


                            rowFrom.attr('category-id', data.categoryId);
                            rowFrom.find('.td-cat-name').text(category.text())
                            rowFrom.find('.td-task-name').text(data.task)
                            rowFrom.find('.td-task-status').text(taskStatus.text())


                            modal.find('.loader-div').css("display", "none");
                            alert('Added successfully');
                            $('#addEditTodoModol').modal('hide')


                            // // update Categorys numbers
                            $PreElCatItemNum = $('.dropdown.cat-dropdown').find(`a[category-id = ${preCat}] .cat_count`);
                            $PreElCatItemNum.text(parseInt($PreElCatItemNum.first().text()) - 1);
                            $NewElCatItemNum = $('.dropdown.cat-dropdown').find(`a[category-id = ${data.categoryId}] .cat_count`);
                            $NewElCatItemNum.text(parseInt($NewElCatItemNum.first().text()) + 1);
                            // $elCatItemNum.click()



                        } else if (resp.status == 'error') {
                            modal.find('.loader-div').css("display", "none");
                        }
                    },

                });
            }

        }


    });


    $('#add-new-cat-action').on("click", function (e) {
        const modal = $(this).closest('.modal');
        const input = modal.find('#form-add-new-cat input');
        const inputText = input.val().trim().toLowerCase()

        passValidation([input])

        if (!modal.find('.is-invalid').length) {

            // Active loder
            modal.find('.loader-div').css("display", "block");

            $.ajax({
                url: "action.php",
                type: 'POST',
                dataType: "json",
                data: {
                    action: 'add_cat',
                    form_data: {
                        'category': inputText
                    }
                },
                success: function (resp) {
                    if (resp.status === 'success') {
                        $('.dropdown.cat-dropdown').find('.dropdown-menu').append(`<a class="dropdown-item" category-id="${resp.categoryId}" href="#"><span class="ddo-name">${resp.categoryName}</span> (<span class="cat_count">0</span>)</a>`);
                        modal.find('.loader-div').css("display", "none");
                        alert('Added successfully');
                        $('#addCategory').modal('hide')
                        $('#addEditTodoModol').modal('show')
                    } else if (resp.status == 'error') {
                        alert(resp.statusCause)
                        modal.find('.loader-div').css("display", "none");
                    }
                },

            });
        }


    });


    const filedValidation = function (obj) {
        if (obj.is('input, textarea')) {
            const input = obj
            if (input.val().trim().length <= 3) {
                input.addClass('is-invalid')
                return false
            } else {
                input.removeClass('is-invalid')
                return true
            }
        }

        if (obj.is('button')) {
            if (obj.attr('category-id') || obj.attr('status-id')) {
                obj.closest('.dropdown').removeClass('is-invalid')
                return true
            } else {
                obj.closest('.dropdown').addClass('is-invalid')
                return false
            }
        }
    }

    const passValidation = (elements) => {
        elements.forEach((el) => {
            filedValidation(el)

        });
    }

    const getRowData = (ele) => ({
        catId: ele.attr('category-id'),
        catText: ele.find('.td-cat-name').text(),
        taskId: ele.find('.task-id').attr('task-id'),
        taskName: ele.find('.td-task-name').text(),
        taskStaus: ele.find('.td-task-status').text(),
    })




});