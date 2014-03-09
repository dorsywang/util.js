<meta http-equiv=Content-Type content="text/html;charset=utf-8">
<?php
/**
* 方法目录构建工具(PHP)
* Function Index Construct Tool For PHP
*
* @author dorsywang@Tencent AlloyTeam
* For a better,fast and effective development life, we have tried it!
*/

define("ROOT",dirname(dirname(__FILE__))."/");
define('SRC_FILE_PATH', ROOT . "src/");
define('INDEX_FILE_PATH', ROOT . "index/");

class IndexConstruction{
    private function get_files_path(){
        $files = scandir(SRC_FILE_PATH);

        $r_files_path = array();

        foreach($files as $file){
            if(preg_match("/[^\.]+\.js$/", $file)){
                array_push($r_files_path, SRC_FILE_PATH . $file);
            }
        }

        return $r_files_path;
    }

    /*
     * 解析一个注释字符
     */
    private function parse_one_doc($doc_str, $func_name, $file_path){
        $description_reg = "";


        $doc_array = explode("\n", $doc_str);

        $doc_array_poc = array();

        foreach($doc_array as $index => $val){
            //去掉前面的*
            $str = preg_replace("|^\s*\*\s*([^/]+)|", "$1", $val);

            //去掉空行
            if(preg_match("|^\s+$|", $str)){
            }else{
                $doc_array_poc[] = trim($str);
            }
        }

        //去掉注释标识符
        array_shift($doc_array_poc);
        array_pop($doc_array_poc);

        $doc_str_poc = implode($doc_array_poc);

        $des_reg = "|^[^@]+|";
        $des_title = "p";


        preg_match($des_reg, $doc_str_poc, $result);
        $des_title = $result[0];

        $intro_str = preg_replace($des_reg, "", $doc_str_poc);

        $markdown_file_path = "../" . str_replace(ROOT, "", SRC_FILE_PATH) . str_replace(SRC_FILE_PATH, "", $file_path);

        //生成markdown str
        $md_str = "##[$func_name]($markdown_file_path)\n$des_title";

        return $md_str;

    }

    private function parse_doc($file_path){
        //拿到一个文档方法注释
        $file_content = file_get_contents($file_path);

        $comment_reg = "|/\*\*[\s\S]*?\*/|m";

        preg_match_all($comment_reg, $file_content, $result);

        $result = $result[0];

        $strlen = strlen($file_content);

        $fun_reg = "/(?:var\s+([^=]+)\s*=\s*function\s*\()|(?:function\s+([^\(]+)\s*\()/m";

        $md_str = "";

        foreach($result as $comment_doc){

            $pos = strpos($file_content, $comment_doc);

            $sub_str = substr($file_content, $pos,  $strlen - $pos); 

            preg_match($fun_reg, $sub_str, $fun_result);

            if(! empty($fun_result[1])){
                $func_name = $fun_result[1];

                $md_str .= "\n\n";

                $md_str .= $this->parse_one_doc($comment_doc, $func_name, $file_path);
            }

        }

        return $md_str;

    }

    public function __construct(){
        $files_path = $this->get_files_path();

        $md_str = "#函数目录";

        foreach($files_path as $file){
            $md_str .= $this->parse_doc($file);
            $md_str .= "\n";
        }

        $this->write_index($md_str);
    }

    private function write_index($md_str){
        $file = fopen(INDEX_FILE_PATH . "all.md", "w+");

        if(fwrite($file, $md_str)){
            echo "成功生成index文件!";
        }else{
            echo "写入index/all.md文件失败!";
        }
    }

    private function write_index_json(){
    }
}
$index_construction = new IndexConstruction();
