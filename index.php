<?php

require "connect.php";



$toDo          = "SELECT `td_id` , `title` , `status` , `created_at` , `category_name` ,`cat_id`   FROM `td_list` INNER JOIN `td_cat` ON td_list.category_id=td_cat.cat_id";
$toDoStatement = $connect->prepare($toDo);
$toDoStatement->execute();
$toDoList = $toDoStatement->fetchAll();

$cat          = "SELECT COUNT(category_id) as cat_count, category_name, cat_id as category_id FROM `td_cat` LEFT JOIN `td_list` ON td_list.category_id=td_cat.cat_id GROUP BY cat_id ORDER BY category_name";
$catStatement = $connect->prepare($cat);
$catStatement->execute();
$catList = $catStatement->fetchAll();



?>


<!DOCTYPE html>
<html>
 <head>
	<title>Yehuda Raz To-Do List</title>  
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="js/popper.min.js" ></script>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.min.css" />
	<script src="js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="css/style.css" />
	<script src="js/script.js"></script>


	
 </head>

 <body>
	<div id="header" class="mt-5">
		<div class="container">
			<h1 class="text-center">Yehuda Raz To-Do List</h1>
				<div class="row p-3 mb-0 bg-secondary text-white align-items-center">

							<div id="categorys-dd-filter">
									<?php
require "inc/cat-dropworn.php";
?>
							</div>
						

							<!-- <div >(<span class="cat-apper-todo-cout"><?php //echo count($toDoList); ?></span>)</div> -->
								
							<div class="ml-auto">
								<button class="btn btn-success btn-lg addMainToDo " data-add="true" data-toggle="modal"   data-new="true" data-target="#addEditTodoModol"><span class="oi oi-plus"></span></button>
							</div>

				</div>
		</div> <!-- .container  -->
	</div>  <!--#header -->

   <div id="tbl-area">
   		<div class="container">
			<table class="table">
				<thead>
					<tr>
					<th scope="col" sort-by="number">#</th>
					<th scope="col" sort-by="name">Category</th>
					<th scope="col" sort-by="name">Task</th>
					<th scope="col" sort-by="number">Status</th>
					<th scope="col" sort-by="date" >Created At</th>
					<th scope="col">Edit</th>
					<th scope="col">Delete</th>
					</tr>
				</thead>

				<tbody>
				<?php
if (count($toDoList)) {
    foreach ($toDoList as $row) {
        echo '<tr category-id="' . $row["cat_id"] . '"> <td class="font-weight-bold task-id"  scope="row" task-id="' . $row["td_id"] . '">' . $row["td_id"] . '</td> <td class="td-cat-name">' . $row["category_name"] . '</td> <td class="td-task-name">' . $row["title"] . '</td> <td class="td-task-status">' . $row["status"] . '</td> <td>' . $row["created_at"] . '</td> <td><button data-toggle="modal" data-edit="true" data-target="#addEditTodoModol" class=" edit-toto"><span class="oi oi-pencil"></span></button></td><td><button class=" delete-todo"><span class="oi oi-trash"></span></button></td></tr>';
    }
} else {
?>	
							<tr class='text-center'>
								<th class="py-5 "colspan="7">Set to do items</th>
							</tr>
						<?php
}
?>
				</tbody>
			</table>
   	 </div>
   </div><!--#tbl-area -->



<!-- Category Modol -->
<div class="modal fade" id="addCategory" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title">Add Category</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
		</div>		  
		<form id="form-add-new-cat">
	  		<div class="modal-body">
				<div class="form-group">
					<label class="col-form-label">Add new category</label>
					<div class="add-cat mb-2">
						<input type="text" class="form-control " placeholder="Add new category" >
						<div class="invalid-feedback">Set text more then 3 letters</div>
					</div>
					
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary mr-auto" data-target="#addEditTodoModol" data-toggle="modal" data-dismiss="modal">Back</button>
				<button type="button" class="btn btn-primary" id="add-new-cat-action">Add</button>
			</div>

		</form>					 
	</div>
	
	 <div class="loader-div justify-content-center align-items-center">
            <div class="loader"></div> 
	</div>

  </div>
</div>


<!-- Add edit - ToDo Modol -->
<div class="modal fade" id="addEditTodoModol" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add new item</h5>
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
			</button>
		  </div>
		  

	  
			<div class="modal-body">
			 	
				<form>
					<div class="form-group" id="category-name-form">
						<label for="category-name-form" class="col-form-label">Category:</label>
						<?php require "inc/cat-dropworn.php"; ?>
						<div class="invalid-feedback">Select option</div>
					</div>
					<div class="form-group" id="todo-taskName-form">
						<label for="todo-taskName-form" class="col-form-label">Task:</label>
						<textarea class="form-control"></textarea>
						<div class="invalid-feedback">Set text more then 3 letters</div>
					</div>
					<div class="form-group" id="todo-taskStatus-form">
						<label for="message-text" class="col-form-label">Status:</label>
						<div class="dropdown my-dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select status</button>
															
							<div class="dropdown-menu">
								<a class="dropdown-item"  status-id="0" href="#"><span class="ddo-name">0</span></a>
								<a class="dropdown-item"  href="#" status-id="1"><span class="ddo-name">1</span></a>
							
							</div>
						</div>
						<div class="invalid-feedback">Select option</div>
					</div>
				</form>
			
			</div>
				<div class="modal-footer">
						<button type="button" class="btn show-addCategory btn-secondary mr-auto" data-target="#addCategory" data-toggle="modal" data-dismiss="modal">Add Category</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-primary" mode="new" id="action-new-edit-task">Add item</button>
				</div>
		 
	</div>
	
	 <div class="loader-div justify-content-center align-items-center">
            <div class="loader"></div> 
	</div>

  </div>
</div>


		


<!-- DELETE ToDo Modol -->
<div class="modal fade" id="DeleteTodoModol" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
		<div class="modal-header alert-danger">
			<h4 class="modal-title">Comfirm deleting this item</h4>
			<button type="button" class="close" data-dismiss="modal">
			<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<div class="modal-body">
			<h5>Are yor sure to delete item?</h5>
			<p class="ml-2 mt-4" style=" line-height: 3em; ">	
				ID: <span id="item-del-id"></span><br>
				Category: <span id="item-del-cat"></span><br>
				Task: <span id="item-del-task"></span><br>
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn  btn-light" data-dismiss="modal">Close</button>
			<button type="button" class="btn btn-danger" id="del-item-action">OK</button>
		</div>
	</div>
	
	<div class="loader-div justify-content-center align-items-center">
            <div class="loader"></div> 
	</div>

  </div>
</div>

  
</body>
</html>






