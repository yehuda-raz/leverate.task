<?php

require "connect.php";



if (is_ajax()) {
    
    if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
        
        $action = $_POST["action"];
        $data   = $_POST["form_data"];
        
        $return['status']      = 'error';
        
        
        switch ($action) {
            
            case 'add_cat':
                $category = $data['category'];
                $query    = $connect->prepare("INSERT INTO `td_cat` ( `category_name`) VALUES ('$category')");
                $query->execute();
                
                // If the category not exsist in the db get the id (if the row exsir return 0) 
                if ($query->rowCount()) {
                    $return['categoryName'] = $category;
                    $return['categoryId']   = $connect->lastInsertId();
                    $return['status']       = 'success';
                } else {
                   
                    $return['statusCause'] = 'Duplicat Category';
                }
                
                echo json_encode($return);
                break;
            
            case 'add_task':
                $task         = $data['task'];
                $categoryId   = $data['categoryId'];
                $taskStatusId = $data['taskStatusId'];
                $date         = date("Y-m-d H:i:s");
                
                $query = $connect->prepare("INSERT INTO `td_list` (`category_id`, `title`, `status`, `created_at`) VALUES (  '$categoryId', '$task',  '$taskStatusId',  '$date')");
                $query->execute();
                $taskId = $connect->lastInsertId();
                
                
                $query = $connect->prepare("SELECT  `category_name` FROM `td_cat` WHERE `cat_id` ='$categoryId'");
                $query->execute();
                $catName = $query->fetch();
                
                
                $return['row']    = '<tr category-id="' . $categoryId . '"> <td class="font-weight-bold task-id"  scope="row" task-id="' . $taskId . '">' . $taskId . '</td> <td class="td-cat-name">' . $catName['category_name'] . '</td> <td class="td-task-name">' . $task . '</td> <td class="td-task-status">' . $taskStatusId . '</td> <td>' . $date . '</td> <td><button data-toggle="modal" data-edit="true" data-target="#addEditTodoModol" class=" edit-toto"><span class="oi oi-pencil"></span></button></td><td><button class=" delete-todo"><span class="oi oi-trash"></span></button></td></tr>';
                $return['status'] = 'success';
                
                echo json_encode($return);
                break;
            
            case 'edit_task':
                $task         = $data['task'];
                $taskId = $data['taskId'];
                $categoryId   = $data['categoryId'];
                $taskStatusId = $data['taskStatusId'];
                $date = date("Y-m-d H:i:s");


                $query = $connect->prepare("UPDATE `td_list` SET `category_id` = '$categoryId', `title` = '$task', `status` = '$taskStatusId ', `updated_at` = '$date' WHERE `td_list`.`td_id` = $taskId");
                $query->execute();

                
                $return['status'] = 'success';
                echo json_encode($return);
                break;
            
            case 'del_task':
               
                $task_id         = $data['task_id'];
                $query    = $connect->prepare("DELETE FROM `td_list` WHERE `td_list`.`td_id` = $task_id");
                $query->execute();
                $return['status'] = 'success';
                echo json_encode($return);
                break;
 
        }
    }
}



//Function to check if the request is an AJAX request
function is_ajax()
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}





function test_function()
{
    $return = $_POST;
    
    //Do what you need to do with the info. The following are some examples.
    //if ($return["favorite_beverage"] == ""){
    //  $return["favorite_beverage"] = "Coke";
    //}
    //$return["favorite_restaurant"] = "McDonald's";
    
    $return["json"] = json_encode($return);
    echo json_encode($return);
}
?>