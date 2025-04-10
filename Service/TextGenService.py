
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DAO.models.My_G2T_model2.textgeneration import text_generation
from DAO.models.My_G2T_model2.search_fragment import get_data_by_head_entity



class TextGenService:
    def __init__(self):
        self.new_yt_data_path = './data/new_YT.json'
        self.entities_info_path = './data/entities_info.json'

    def text_generation_service(self, triplets_list):
        text_result = text_generation(triplets_list)
        return text_result

    def search_Fragments_service(self, entity):
        fragment_result = get_data_by_head_entity(entity)

        return fragment_result
