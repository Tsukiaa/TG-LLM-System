import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DAO.models.My_TGLLM_model3.src.predict import get_answer
from DAO.models.My_TGLLM_model3.src.predict_other_model import get_answer2



class ProblemService:
    def __init__(self):
        self.new_yt_data_path = './data/new_YT.json'
        self.entities_info_path = './data/entities_info.json'

    def get_answer_service(self, question):
        answer_result = get_answer(question)
        return answer_result

    def get_answer_service_other_model(self, question):
        answer_result = get_answer2(question)
        return answer_result