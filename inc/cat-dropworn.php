
<div class="dropdown cat-dropdown my-dropdown 2222">
	<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		<?= (count($catList)) ? 'All categorys' : 'Add category'?>
     </button>
                                    
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        
       
        <a class="dropdown-item all-cat-dd" href="#"><span class="ddo-name">All categorys</span> (<span class="cat_count cat_count-all"><?php echo count($toDoList) ?></span>)</a>
        <?php 
        foreach($catList as $row)
            {
                echo '<a class="dropdown-item" category-id="'.$row["category_id"].'"   href="#"><span class="ddo-name">'.$row["category_name"].'</span> (<span class="cat_count">'.$row["cat_count"].'</span>)</a>';
            }
        ?>
    </div>
</div>